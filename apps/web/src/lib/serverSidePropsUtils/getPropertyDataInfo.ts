import { PropertyData } from '@lib/realty-mole/collectPropertyData'
import { PropertyData as PrismaPropertyData } from '@restorationx/db'
import { PropertyDataInfo } from '@atoms/propertyDataInfoState'
import superjson from 'superjson'

const getPropertyDataInfo = (
  propertyData: PrismaPropertyData | null
): PropertyDataInfo => {
  return {
    bathrooms: propertyData?.bathrooms || null,
    bedrooms: propertyData?.bedrooms || null,
    squareFootage: propertyData?.squareFootage || null,
    data: superjson.serialize(propertyData?.data || {}).json as PropertyData,
  }
}

export default getPropertyDataInfo
