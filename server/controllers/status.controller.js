const httpErrors = require('http-errors');
const StatusMongo = require('../models/mongo/status.mongo');
const sequelize = require('../models/sql');
const {
  statusCreateSchema,
  statusQuerySchema,
  statusUpdateSchema,
} = require('../schemas/status.schema');
const { NotFound } = httpErrors;

const Status = sequelize.model('status');

/**
 * Créer un status
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function createStatus(req, res, next) {
  try {
    const statusCreationData = statusCreateSchema.parse(req.body);

    const newStatus = await sequelize.transaction(async (t) => {
      const data = await Status.create(statusCreationData, {
        transaction: t,
      });

      const statusMongo = data.toMongo();

      const statusDoc = await StatusMongo.create(statusMongo);

      return {
        id: statusDoc.id,
        label: statusDoc.label,
      };
    });

    return res.status(201).json(newStatus);
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getStatuses(req, res, next) {
  try {
    const { page, text, pageSize } = statusQuerySchema.parse(req.query);

    /**
     * @type {import('mongoose').PipelineStage[]  }
     */
    const pipelineStages = [];

    if (text) {
      pipelineStages.push(
        {
          $match: {
            $text: {
              $search: text,
              $diacriticSensitive: false,
              $caseSensitive: false,
            },
          },
        },
        {
          $sort: { score: { $meta: 'textScore' } },
        },
      );
    }

    pipelineStages.push({
      $facet: {
        metadata: [
          { $count: 'total' },
          {
            $set: {
              page,
              totalPages: { $ceil: { $divide: ['$total', pageSize] } },
              pageSize,
            },
          },
        ],
        items: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
      },
    });

    const [{ items, metadata }] = await StatusMongo.aggregate(pipelineStages);

    return res.json({
      metadata: metadata[0] ?? {
        total: 0,
        page: 1,
        totalPages: 0,
        pageSize,
      },
      items: items ?? [],
    });
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function replaceStatus(req, res, next) {
  try {
    const statusId = req.params.id;

    const body = statusCreateSchema.parse(req.body);

    const status = await sequelize.transaction(async (t) => {
      const [data] = await Status.upsert(
        { ...body, id: statusId },
        {
          validate: true,
          transaction: t,
          returning: true,
        },
      );

      const statusMongo = data.toMongo();

      await StatusMongo.updateOne(
        {
          _id: statusId,
        },
        statusMongo,
        {
          upsert: true,
          setDefaultsOnInsert: true,
        },
      );

      return data;
    });

    return res.status(200).json(status);
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function updateStatus(req, res, next) {
  try {
    const statusId = req.params.id;

    const statusUpdateData = statusUpdateSchema.parse(req.body);

    const newStatus = await sequelize.transaction(async (t) => {
      const [nbUpdated, statuses] = await Status.update(statusUpdateData, {
        where: {
          id: statusId,
        },
        limit: 1,
        validate: true,
        transaction: t,
        returning: true,
      });

      if (nbUpdated === 0) {
        throw new NotFound();
      }

      const statusMongo = statuses[0].toMongo();

      const updateResult = await StatusMongo.updateOne(
        {
          _id: statusId,
        },
        statusMongo,
      );

      if (updateResult.matchedCount === 0) {
        throw new NotFound();
      }
    });

    return res.status(200).json(newStatus);
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function deleteStatus(req, res, next) {
  try {
    const statusId = req.params.id;
    const nbDeleted = await Status.destroy({ where: { id: statusId } });
    const { deletedCount } = await StatusMongo.deleteOne({ _id: statusId });

    if (nbDeleted === 0 || deletedCount === 0) {
      return res.sendStatus(404);
    }

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createStatus,
  getStatuses,
  replaceStatus,
  updateStatus,
  deleteStatus,
};
