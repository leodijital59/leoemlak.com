import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import type {ChartConfig} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"

const chartConfig = {
  count: {
    label: "İlan Sayısı",
    color: "var(--primary)",
  },
} satisfies ChartConfig

interface CategoryChartProps {
  data: { categoryName: string; count: number }[]
}

export function CategoryChart({ data }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kategorilere Göre İlanlar</CardTitle>
          <CardDescription>Henüz ilan bulunmuyor.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kategorilere Göre İlanlar</CardTitle>
        <CardDescription>Kategorilere göre ilan dağılımı</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="categoryName"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
