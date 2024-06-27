import { Cities } from "@/components/geography/cities"
import { CitiesTable } from "@/components/geography/cities-table"
import { Countries } from "@/components/geography/countries"
import { CountryTable } from "@/components/geography/country-table"
import { GeoMap } from "@/components/geography/geo-map"

const Geography = () => {
  return (
    <div className="mb-20 flex flex-col gap-8">
      <GeoMap />
      <div className="flex w-full items-stretch gap-4">
        <div className="w-1/3">
          <Countries />
        </div>
        <div className="w-2/3">
          <CountryTable />
        </div>
      </div>
      <div className="flex w-full items-stretch gap-4">
        <div className="w-1/3">
          <Cities />
        </div>
        <div className="w-2/3">
          <CitiesTable />
        </div>
      </div>
    </div>
  )
}

export { Geography }
