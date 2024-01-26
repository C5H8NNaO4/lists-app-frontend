import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { colors } from '../../lib/colors';
import { DateFormatter } from '../../lib/analytics';
import { Box } from '@mui/material';
import { useComponent } from '@state-less/react-client';
import { List } from '../../server-components/examples/Lists';

export const ExampleChart = ({ data }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip
            content={({ payload }) => (
              <CustomTooltip active={undefined} payload={payload} />
            )}
          />
          <XAxis dataKey="date" tickFormatter={DateFormatter('dd.MM')} />
          <Legend />

          {Object.keys(data.reduce((acc, cur) => ({ ...acc, ...cur }), {}))
            .filter((key) => !['date', 'createdAt', 'archived'].includes(key))
            .map((key, i) => {
              return (
                <Line
                  strokeWidth={2}
                  dataKey={key}
                  connectNulls
                  stroke={colors[0][i]}
                />
              );
            })}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
