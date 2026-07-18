import { Box, Flex, Skeleton, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useEcoCounterHistory } from "../services/queries";
import { plural } from "../utils/format";

/** Couleur validée (bande de luminance + contraste) sur les deux thèmes. */
const SERIES_COLOR = "#8B5CF6";

const WIDTH = 340;
const HEIGHT = 96;
const PLOT_TOP = 8;
const PLOT_BOTTOM = HEIGHT - 20; // laisse la place aux libellés d'heures

type Props = { counterId: string };

/**
 * Mini-graphe des passages de vélos mesurés heure par heure (24 dernières
 * mesures du compteur). Survol : lecture point par point.
 */
const EcoCounterSparkline = ({ counterId }: Props) => {
  const { data, isLoading } = useEcoCounterHistory(counterId);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const geometry = useMemo(() => {
    if (!data || data.length < 2) return null;
    const max = Math.max(...data.map((p) => p.value));
    // Échelle d'au moins 1 pour qu'une série toute à zéro reste sur la ligne de base.
    const scaleMax = Math.max(max, 1);
    const stepX = WIDTH / (data.length - 1);
    const points = data.map((p, i) => ({
      x: i * stepX,
      y: PLOT_BOTTOM - (p.value / scaleMax) * (PLOT_BOTTOM - PLOT_TOP),
    }));
    const line = points.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join("");
    const area = `${line}L${WIDTH},${PLOT_BOTTOM}L0,${PLOT_BOTTOM}Z`;
    const maxIndex = data.reduce(
      (best, p, i) => (p.value > data[best].value ? i : best),
      0
    );
    return { points, line, area, max, maxIndex };
  }, [data]);

  if (isLoading) return <Skeleton h="120px" mt="4" borderRadius="12px" />;

  if (!geometry || !data) {
    return (
      <Text fontSize="sm" color="fg.muted" mt="4">
        Pas d'historique récent pour ce compteur.
      </Text>
    );
  }

  const hourOf = (iso: string) =>
    `${new Date(iso).getHours().toString().padStart(2, "0")} h`;

  const active = Math.min(hoverIndex ?? geometry.maxIndex, data.length - 1);
  const activePoint = data[active];
  const activeGeom = geometry.points[active];

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const index = Math.round((x / WIDTH) * (data.length - 1));
    setHoverIndex(Math.min(data.length - 1, Math.max(0, index)));
  };

  return (
    <Box mt="4">
      <Flex align="baseline" justify="space-between" gap="3">
        <Text fontSize="sm" fontWeight="600">
          Passages par heure
        </Text>
        <Text fontSize="xs" color="fg.muted">
          {hoverIndex === null ? "pic : " : ""}
          {hourOf(activePoint.time)} · {plural(activePoint.value, "passage")}
        </Text>
      </Flex>
      <Box
        as="svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`Passages de vélos par heure sur les ${data.length} dernières mesures, maximum ${geometry.max} à ${hourOf(data[geometry.maxIndex].time)}`}
        w="100%"
        h="auto"
        mt="2"
        display="block"
        onPointerMove={onPointerMove}
        onPointerLeave={() => setHoverIndex(null)}
      >
        {/* Ligne de base */}
        <line
          x1="0"
          y1={PLOT_BOTTOM}
          x2={WIDTH}
          y2={PLOT_BOTTOM}
          stroke="var(--chakra-colors-border-default)"
          strokeWidth="1"
        />
        <path d={geometry.area} fill={SERIES_COLOR} opacity="0.12" />
        <path
          d={geometry.line}
          fill="none"
          stroke={SERIES_COLOR}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Point actif (survol, sinon le pic) avec anneau de surface */}
        <circle
          cx={activeGeom.x}
          cy={activeGeom.y}
          r="5.5"
          fill="var(--chakra-colors-bg-surface)"
        />
        <circle cx={activeGeom.x} cy={activeGeom.y} r="4" fill={SERIES_COLOR} />
        {/* Libellés de début / fin */}
        <text
          x="0"
          y={HEIGHT - 4}
          fontSize="10"
          fill="var(--chakra-colors-fg-muted)"
        >
          {hourOf(data[0].time)}
        </text>
        <text
          x={WIDTH}
          y={HEIGHT - 4}
          fontSize="10"
          textAnchor="end"
          fill="var(--chakra-colors-fg-muted)"
        >
          {hourOf(data[data.length - 1].time)}
        </text>
      </Box>
    </Box>
  );
};

export default EcoCounterSparkline;
