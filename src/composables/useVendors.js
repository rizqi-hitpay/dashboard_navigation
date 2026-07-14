// Shared vendors mock data, used by the vendors list and the vendor detail view.

export const vendors = [
  { id: 1, name: 'Azure Holdings', email: 'contact@randommail.com', payment: 'GIRO / ****8901', more: 1, moreMethods: ['SWIFT / ****4412'], lastPayment: '2025-08-15', addedOn: '2020-04-23', status: 'Active' },
  { id: 2, name: 'Titan Group', email: 'info@randomsite.com', payment: 'SWIFT / ****1230', lastPayment: '2025-11-05', addedOn: '2021-03-15', status: 'Active' },
  { id: 3, name: 'Orion Ventures', email: 'user@randomdomain.com', payment: 'Local Transfer / ****9012', more: 3, moreMethods: ['FAST / ****5678', 'Local Transfer / ****8765', 'GIRO / ****8901'], lastPayment: '2025-12-12', addedOn: '2020-09-01', status: 'Active' },
  { id: 4, name: 'Orion Ventures', starred: true, email: 'support@sampledomain.com', payment: 'SWIFT / ****6789', lastPayment: '2025-09-10', addedOn: '2021-11-02', status: 'Active' },
  { id: 5, name: 'Vanguard Industries', email: 'hello@samplemail.com', payment: 'FAST / ****2345', lastPayment: '2026-01-30', addedOn: '2023-04-12', status: 'Active' },
  { id: 6, name: 'Zenith Technologies', email: 'info@uniqueaddress.com', payment: 'Local Transfer / ****8765', more: 2, moreMethods: ['GIRO / ****2210', 'SWIFT / ****9034'], lastPayment: '2026-02-14', addedOn: '2020-12-05', status: 'Active' },
  { id: 7, name: 'Summit Enterprises', email: 'service@newmail.com', payment: 'GIRO / ****5432', lastPayment: '2026-03-01', addedOn: '2023-07-18', status: 'Active' },
  { id: 8, name: 'Nova Dynamics', email: 'support@fakemail.com', payment: 'GIRO / ****4321', lastPayment: '2026-04-18', addedOn: '2020-02-29', status: 'Active' },
  { id: 9, name: 'Apex Solutions', email: 'hello@anotheraddress.com', payment: 'FAST / ****5678', lastPayment: '2026-05-25', addedOn: '2021-09-30', status: 'Active' },
  { id: 10, name: 'Zeta Innovations', email: 'user@uniqueemail.com', missing: true, lastPayment: '2026-06-30', addedOn: '2020-06-10', status: 'Inactive' },
  { id: 11, name: 'Orion Ventures', email: 'contact@differentmail.com', payment: 'Local Transfer / ****3456', lastPayment: '2025-10-22', addedOn: '2021-01-04', status: 'Archive' },
]

export function getVendor(id) {
  return vendors.find((v) => String(v.id) === String(id)) || null
}
