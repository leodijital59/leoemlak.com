import type { PropertyData } from '@/types/property-display'
import { formatAddress } from '@/lib/formatters'

type Props = {
    property: PropertyData
}

const PropertyAddress = ({ property }: Props) => {
    const fullAddress = formatAddress(property.province, property.district, property.neighborhood)

    // Use coordinates if available, otherwise use address text
    const mapQuery = property.latitude && property.longitude
        ? `${property.latitude},${property.longitude}`
        : encodeURIComponent(fullAddress)

    return (
        <iframe
            className="position-relative bdrs12 h250 w-100"
            loading="lazy"
            src={`https://maps.google.com/maps?q=${mapQuery}&t=m&z=14&output=embed&iwloc=near`}
            title={fullAddress}
            aria-label={fullAddress}
        />
    );
};

export default PropertyAddress;
