import { ZodIssueCode, ZodParsedType, util } from 'zod';

/**
 *
 * @type {import("zod").ZodErrorMap}
 * @returns
 */
const errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = 'Requis';
      } else {
        message = `Type invalide, attendu ${issue.expected}, reçu ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Valeur invalide, attendu ${JSON.stringify(
        issue.expected,
        util.jsonStringifyReplacer,
      )}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Clé(s) non reconnue(s) dans l'objet : ${util.joinValues(
        issue.keys,
        ', ',
      )}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Entrée invalide`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Valeur de discriminateur invalide. Attendu ${util.joinValues(
        issue.options,
      )}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Valeur d'énumération invalide. Attendu ${util.joinValues(
        issue.options,
      )}, reçu '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Arguments de fonction invalides`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Type de retour de fonction invalide`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Date invalide`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === 'object') {
        if ('includes' in issue.validation) {
          message = `Entrée invalide : doit inclure "${issue.validation.includes}"`;

          if (typeof issue.validation.position === 'number') {
            message = `${message} à une ou plusieurs positions supérieures ou égales à ${issue.validation.position}`;
          }
        } else if ('startsWith' in issue.validation) {
          message = `Entrée invalide : doit commencer par "${issue.validation.startsWith}"`;
        } else if ('endsWith' in issue.validation) {
          message = `Entrée invalide : doit se terminer par "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== 'regex') {
        message = `Entrée invalide : ${issue.validation}`;
      } else {
        message = 'Entrée invalide';
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === 'array')
        message = `Le tableau doit contenir ${
          issue.exact ? 'exactement' : issue.inclusive ? `au moins` : `plus de`
        } ${issue.minimum} élément(s)`;
      else if (issue.type === 'string')
        message = `La chaîne de caractères doit contenir ${
          issue.exact ? 'exactement' : issue.inclusive ? `au moins` : `plus de`
        } ${issue.minimum} caractère(s)`;
      else if (issue.type === 'number')
        message = `Le nombre doit être ${
          issue.exact
            ? `égal à `
            : issue.inclusive
              ? `supérieur ou égal à `
              : `supérieur à `
        }${issue.minimum}`;
      else if (issue.type === 'date')
        message = `La date doit être ${
          issue.exact
            ? `égale à `
            : issue.inclusive
              ? `supérieure ou égale à `
              : `supérieure à `
        }${new Date(Number(issue.minimum))}`;
      else message = 'Entrée invalide';
      break;
    case ZodIssueCode.too_big:
      if (issue.type === 'array')
        message = `Le tableau doit contenir ${
          issue.exact ? `exactement` : issue.inclusive ? `au plus` : `moins de`
        } ${issue.maximum} élément(s)`;
      else if (issue.type === 'string')
        message = `La chaîne de caractères doit contenir ${
          issue.exact ? `exactement` : issue.inclusive ? `au plus` : `moins de`
        } ${issue.maximum} caractère(s)`;
      else if (issue.type === 'number')
        message = `Le nombre doit être ${
          issue.exact
            ? `égal à`
            : issue.inclusive
              ? `inférieur ou égal à`
              : `inférieur à`
        } ${issue.maximum}`;
      else if (issue.type === 'bigint')
        message = `Le nombre entier doit être ${
          issue.exact
            ? `égal à`
            : issue.inclusive
              ? `inférieur ou égal à`
              : `inférieur à`
        } ${issue.maximum}`;
      else if (issue.type === 'date')
        message = `La date doit être ${
          issue.exact
            ? `égale à`
            : issue.inclusive
              ? `inférieure ou égale à`
              : `inférieure à`
        } ${new Date(Number(issue.maximum))}`;
      else message = 'Entrée invalide';
      break;
    case ZodIssueCode.custom:
      message = `Entrée invalide`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Les résultats de l'intersection ne peuvent pas être fusionnés`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Le nombre doit être un multiple de ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = 'Le nombre doit être fini';
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};

export default errorMap;
