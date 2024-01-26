import { CartesianGrid, LineChart, Tooltip } from "recharts";
import { CustomTooltip } from "./CustomTooltip";

export const ExampleChart = () => {
  return (
    <LineChart data={countersDataDays}>
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip
        content={({ payload, active }) => (
          <CustomTooltip
            active={Object.keys(visibility).filter((key) =>
              invert ? !visibility[key] : visibility[key]
            )}
            payload={payload}
          />
        )}
      />
      <XAxis dataKey="date" tickFormatter={DateFormatter('dd.MM')} />
      <Legend content={renderCustomLegend as any} />

      {Object.keys(
        dataDays.reduce((acc, cur) => ({ ...acc, ...cur }), {}) || {}
      ).map((key, i) => {
        let visible = visibility[key] !== false;
        if (invert) visible = !visible;
        if (key === 'date') return null;
        return (
          <Line
            strokeWidth={2}
            dataKey={visible ? key : ' ' + key}
            connectNulls
            stroke={colors[i]}
          />
        );
      })}
    </LineChart>
  );
};
