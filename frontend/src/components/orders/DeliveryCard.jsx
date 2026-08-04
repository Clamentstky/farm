import { FaMapMarkerAlt } from 'react-icons/fa'

export default function DeliveryCard({ customer, order }) {
  const address = order?.address
  const name = address?.full_name || customer?.full_name || customer?.name || 'Customer'
  const phone = address?.mobile_number || customer?.phone
  const lines = address
    ? [
        address.address,
        [address.village, address.district].filter(Boolean).join(', '),
        [address.state, address.pincode].filter(Boolean).join(' - '),
        address.landmark ? `Landmark: ${address.landmark}` : '',
      ].filter(Boolean)
    : [customer?.address || 'Delivery address not available']

  return (
    <section className="rounded-3xl border border-soil-100 bg-white p-6 shadow-sm md:p-8">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-black text-soil-900">
        <FaMapMarkerAlt className="text-[#2d6f35]" />
        Delivery Address
      </h2>

      <div className="space-y-2 text-sm font-medium text-soil-600">
        <p className="text-base font-black text-soil-900">{name}</p>
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
        {phone && (
          <p className="mt-4 inline-flex rounded-lg bg-[#eef3ee] px-3 py-2 font-extrabold text-[#2d6f35]">
            Phone: {phone}
          </p>
        )}
      </div>
    </section>
  )
}
