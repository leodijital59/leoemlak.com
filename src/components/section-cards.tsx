import { IconBuilding, IconBuildingSkyscraper, IconCategory, IconList } from "@tabler/icons-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SectionCardsProps {
  totalProperties: number
  activeProperties: number
  totalCategories: number
  totalFeatures: number
}

export function SectionCards({
  totalProperties,
  activeProperties,
  totalCategories,
  totalFeatures,
}: SectionCardsProps) {
  const cards = [
    { label: "Toplam İlan", value: totalProperties, icon: IconBuilding },
    { label: "Aktif İlanlar", value: activeProperties, icon: IconBuildingSkyscraper },
    { label: "Kategoriler", value: totalCategories, icon: IconCategory },
    { label: "Özellikler", value: totalFeatures, icon: IconList },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <card.icon className="size-4" />
              {card.label}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.value}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
