const { generateTrackingEvents } = require("../../utils/trackingUtils");

describe('generateTrackingEvents', () => {
  it('should generate tracking events correctly', () => {
    const order = {
      createdAt: '2022-01-01T00:00:00.000Z',
      orderNumber: '123456789',
      status: {
        label: 'Delivered',
        _id: '123'
      },
      address: {
        city: 'Lyon',
        zipCode: '69000'
      }
    };

    const expectedResult = {
      tracking_number: '123456789',
      status_description: 'Delivered',
      status_code: '123',
      carrier_code: 'DHL',
      events: [
        {
          occurred_at: '2022-01-01T00:00:00.000Z',
          description: 'Commande reçue.',
          city_locality: 'Paris',
          state_province: 'Île-de-France',
          country_code: 'FR',
          event_code: 'RECEIVED'
        },
        {
          occurred_at: '2022-01-02T10:00:00.000Z',
          description: 'Colis expédié.',
          city_locality: 'Paris',
          state_province: 'Île-de-France',
          country_code: 'FR',
          event_code: 'SHIPPED'
        },
        {
          occurred_at: '2022-01-03T12:30:00.000Z',
          description: 'Colis en transit.',
          city_locality: 'Cergy',
          state_province: 'Île-de-France',
          country_code: 'FR',
          event_code: 'IN_TRANSIT'
        },
        {
          occurred_at: '2022-01-04T14:45:00.000Z',
          description: 'En cours de livraison.',
          city_locality: 'Lyon',
          state_province: '69000',
          country_code: 'FR',
          event_code: 'OUT_FOR_DELIVERY'
        },
        {
          occurred_at: '2022-01-04T16:00:00.000Z',
          description: 'Colis livré.',
          city_locality: 'Lyon',
          state_province: '69000',
          country_code: 'FR',
          event_code: 'DELIVERED'
        }
      ]
    };

    const result = generateTrackingEvents(order);
    expect(result).toEqual(expectedResult);
  });

  it('should not include events for delivered orders', () => {
    const order = {
      createdAt: '2022-01-01T00:00:00.000Z',
      orderNumber: '123456789',
      status: {
        label: 'delivered',
        _id: '123'
      },
      address: {
        city: 'Lyon',
        zipCode: '69000'
      }
    };

    const result = generateTrackingEvents(order);
    expect(result.events.length).toBe(1);
    expect(result.events[0].event_code).toBe('RECEIVED');
  });
});
