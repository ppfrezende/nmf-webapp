'use client'

import { ChartPie } from 'lucide-react'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type { TotalDisciplinesStats } from '@/hooks/projects/use-disciplines'

export const description = 'A radar chart with dots'

const chartConfig = {
  pct: {
    label: '%',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

interface DisciplinesChartStatsProps {
  disciplines: TotalDisciplinesStats[]
}

export function DisciplinesChartStats({
  disciplines,
}: DisciplinesChartStatsProps) {
  const chartData = disciplines.map(
    ({ disciplineName, performancePercentage }) => ({
      discipline: disciplineName,
      pct: performancePercentage,
    })
  )
  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle className="flex items-center gap-2">
          <ChartPie />
          Gráfico de Desempenho
        </CardTitle>
        <CardDescription>
          Mostrando o total de desempenho nas disciplinas
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto  max-h-[250px]">
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="discipline" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <PolarGrid />
            <Radar
              dataKey="pct"
              fill="var(--color-pct)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          January - June 2024
        </div>
      </CardFooter> */}
    </Card>
  )
}
