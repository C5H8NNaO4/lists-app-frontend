import { useComponent } from '@state-less/react-client';
import { Container, Alert, Typography, Box } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Surface,
  Symbols,
  Tooltip,
  XAxis,
} from 'recharts';
import { Paper, ListItem, ListItemText } from '@mui/material';
import deepmerge from 'deepmerge';
import {
  differenceInDays,
  differenceInMonths,
  format,
  getMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from 'date-fns';
import { useState } from 'react';

const colors = [
  '#9e0142',
  '#d53e4f',
  '#f46d43',
  '#fdae61',
  '#fee08b',
  '#e6f598',
  '#abdda4',
  '#66c2a5',
  '#3288bd',
  '#5e4fa2',
  'black',
];

const DateFormatter = (formatStr) => (value) => {
  try {
    return format(new Date(value), formatStr);
  } catch (e) {
    return value;
  }
};
export const AnalyticsPage = (props) => {
  const [component, { loading, error, refetch }] = useComponent('my-lists', {});

  const countersMonth = component?.children.reduce((acc, list) => {
    const childs = list.children
      .filter((todo) => 'count' in todo.props)
      .reduce((acc, todo) => {
        const date = startOfMonth(
          new Date(todo.props.createdAt || todo.props.archived || Date.now())
        ).getTime();
        acc[date] = {
          ...acc[date],
          [todo.props.title]:
            (acc?.[date]?.[todo.props.title] || 0) + todo.props.count,
          date,
        };
        return acc;
      }, {});

    return deepmerge(acc, childs);
  }, {});

  const countersDays = component?.children.reduce((acc, list) => {
    const childs = list.children
      .filter((todo) => {
        const diff = differenceInMonths(
          new Date(
            todo.props.lastModified ||
              todo.props.createdAt ||
              todo.props.archived ||
              Date.now()
          ),
          Date.now()
        );
        return 'count' in todo.props && diff === 0;
      })
      .reduce((acc, todo) => {
        const date = startOfDay(
          new Date(
            todo.props.archived
              ? todo.props.archived
              : todo.props.lastModified || todo.props.createdAt || Date.now()
          )
        ).getTime();
        acc[date] = {
          ...acc[date],
          [todo.props.title]:
            (acc?.[date]?.[todo.props.title] || 0) + todo.props.count,
          date,
        };
        return acc;
      }, {});

    return deepmerge(acc, childs);
  }, {});

  const countersData = Object.keys(countersMonth || {})
    .sort((a, b) => {
      return a.localeCompare(b);
    })
    .map((key) => countersMonth[key]);

  const countersDataDays = Object.keys(countersDays || {})
    .sort((a, b) => {
      return a.localeCompare(b);
    })
    .map((key) => countersDays[key]);

  const data = ((countersMonth && Object.values(countersMonth)) || []).flat();
  const dataDays = ((countersDays && Object.values(countersDays)) || []).flat();

  const categories = component?.children
    ?.filter((list) => {
      return list.props.settings.defaultType === 'Expense';
    })
    .reduce((acc, list) => {
      const dates = list.children
        .filter((todo) => typeof todo.props.archived === 'number')
        .reduce((acc, todo) => {
          const date = startOfMonth(
            new Date(todo.props.archived || todo.props.createdAt || Date.now())
          ).getTime();
          return {
            ...acc,
            [date]: {
              ...acc[date],
              [`${list.props.title}`]:
                ((acc[date] || {})[list.props.title] || 0) +
                (+todo.props.value || 0),
              date,
            },
          };
        }, {});
      return deepmerge(acc, dates);
    }, {});

  const months = Object.keys(categories || {});
  const pieData = months.map((month) =>
    Object.keys((categories || {})[month] || {})
      .filter((key) => key !== 'date')
      .map((key) => {
        return {
          name: key,
          value: Math.abs(categories[month][key]),
        };
      })
  );
  const expenseData = Object.keys(categories || {})
    .sort((a, b) => {
      return a.localeCompare(b);
    })
    .map((key) => categories[key]);

  const sumPos = Object.values(categories || {}).reduce(
    (acc: any, { date, ...data }: any) => {
      return {
        ...acc,
        [date]: {
          income: Object.values(data as any).reduce(
            ((acc: number, value: number) => {
              if (value > 0) return acc + value;
              return acc;
            }) as any,
            0
          ),
          expenses: Object.values(data).reduce(
            ((acc, value) => {
              if (value < 0) return acc - value;
              return acc;
            }) as any,
            0
          ),
          date,
        },
      };
    },
    {} as any
  ) as Record<string, { income: number; expenses: number }[]>;

  const itemsCompleted = component?.children?.reduce((acc, list) => {
    const dates = list.children
      .filter(
        (todo) =>
          typeof todo.props.createdAt === 'number' ||
          typeof todo.props.lastModified === 'number'
      )
      .reduce((acc, todo) => {
        const date = startOfDay(
          new Date(todo.props.lastModified || todo.props.createdAt)
        ).getTime();

        return {
          ...acc,
          [date]: {
            archived: ~~acc[date]?.archived + (todo.props.archived ? 1 : 0),
            completed: ~~acc[date]?.completed + (todo.props.completed ? 1 : 0),
            created: ~~acc[date]?.created + (todo.props.createdAt ? 1 : 0),
            date,
          },
        };
      }, acc);
    return deepmerge(acc, dates);
  }, {});

  const lists = component?.children?.filter(
    (list) => list?.props.settings?.defaultType === 'Todo'
  );

  const lastWeek = Array.from(Array(7))
    .map((e, i, arr) => {
      return {
        date: subDays(new Date(), arr.length - (i + 1)),
      };
    })
    .map((entry, week) => {
      return {
        ...entry,
        ...(lists || []).reduce(
          (acc, list) => ({
            ...acc,
            [list.props.title]: list.children?.reduce((acc, item) => {
              if (!item?.props?.createdAt) return acc;
              if (
                format(item?.props?.createdAt, 'MM.dd') >
                format(entry.date, 'MM.dd')
              )
                return acc;

              if (
                item?.props?.lastModified &&
                item?.props?.completed &&
                format(item?.props?.lastModified, 'MM.dd') <=
                  format(entry.date, 'MM.dd')
              )
                return acc;
              if (
                format(item?.props?.createdAt, 'MM.dd') <=
                format(entry.date, 'MM.dd')
              )
                return acc + 1;
            }, 0),
          }),
          {}
        ),
      };
    });

  const [active, setActive] = useState(null);
  const [visibility, setVisibility] = useState({});

  const renderCustomLegend = ({ payload }) => {
    return (
      <div className="customized-legend">
        {payload.map((entry) => {
          const { dataKey, color } = entry;
          const active = visibility[dataKey] === false;
          const style = {
            marginRight: 10,
            color: active ? '#AAA' : '#000',
          };

          return (
            <span
              className="legend-item"
              onClick={(e) => {
                setVisibility((visibility) => ({
                  ...visibility,
                  [dataKey.trim()]:
                    visibility[dataKey.trim()] === false ? true : false,
                }));
              }}
              style={style}
            >
              <Surface
                width={10}
                height={10}
                viewBox={{ x: 0, y: 0, width: 10, height: 10 }}
              >
                <Symbols cx={5} cy={5} type="circle" size={50} fill={color} />
                {active && (
                  <Symbols
                    cx={5}
                    cy={5}
                    type="circle"
                    size={25}
                    fill={'#FFF'}
                  />
                )}
              </Surface>
              <span>{dataKey}</span>
            </span>
          );
        })}
      </div>
    );
  };

  const countersLineChart = (
    <LineChart data={countersDataDays}>
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip
        content={({ payload }) => (
          <CustomTooltip active={active} payload={payload} />
        )}
      />
      <XAxis dataKey="date" tickFormatter={DateFormatter('dd.MM')} />
      <Legend content={renderCustomLegend as any} />

      {Object.keys(
        dataDays.reduce((acc, cur) => ({ ...acc, ...cur }), {}) || {}
      ).map((key, i) => {
        const visible = visibility[key] !== false;
        if (key === 'date') return null;
        return (
          <Line
            dataKey={visible ? key : ' ' + key}
            connectNulls
            stroke={colors[i]}
          />
        );
      })}
    </LineChart>
  );
  const burndownChart = (
    <LineChart data={lastWeek}>
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip
        content={({ payload }) => (
          <CustomTooltip active={active} payload={payload} />
        )}
      />
      <XAxis dataKey="date" tickFormatter={DateFormatter('dd.MM')} />
      <Legend
        onClick={(e) => {
          setActive(e.dataKey === active ? null : e.dataKey);
        }}
      />

      {Object.keys(lastWeek[0] || {}).map((key, i) => {
        if (key === 'date' || (active && key !== active)) return null;
        return <Line dataKey={key} stroke={colors[i]} />;
      })}
    </LineChart>
  );
  const expenseChart = (
    <BarChart data={expenseData}>
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip content={({ payload }) => <CustomTooltip payload={payload} />} />

      <XAxis dataKey="date" tickFormatter={DateFormatter('MMMM')} />
      <Legend />

      {Object.keys(expenseData[0] || {}).map((key, i) => {
        if (key === 'date') return null;
        return <Bar dataKey={key} fill={colors[i]} />;
      })}
    </BarChart>
  );
  const expensePieChart = pieData.map((pieData) => {
    return (
      <PieChart>
        <Legend />
        {
          <Pie
            data={pieData || []}
            dataKey={'value'}
            nameKey={'name'}
            fill={colors[0]}
            label
          >
            {(pieData || []).map((entry, index) => (
              <Cell fill={colors[index % colors.length]} />
            ))}
          </Pie>
        }
      </PieChart>
    );
  });

  const itemData = Object.keys(itemsCompleted || {})
    .sort((a, b) => {
      return a.localeCompare(b);
    })
    .map((key) => itemsCompleted[key]);
  const itemChart = (
    <BarChart data={itemData}>
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip content={({ payload }) => <CustomTooltip payload={payload} />} />

      <XAxis dataKey="date" tickFormatter={DateFormatter('dd.MM.yy')} />
      <Legend />

      {Object.keys(itemData[0] || {}).map((key, i) => {
        if (key === 'date') return null;
        return <Bar dataKey={key} fill={colors[i]} />;
      })}
    </BarChart>
  );
  const sumData = Object.keys(sumPos || {})
    .sort((a, b) => {
      return a.localeCompare(b);
    })
    .map((key) => sumPos[key]);

  const sumChart = (
    <BarChart data={sumData}>
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip
        cursor={{ fill: '#FFFFFFAA' }}
        content={({ payload }) => <CustomTooltip payload={payload} />}
      />

      <XAxis dataKey="date" tickFormatter={DateFormatter('MMMM')} />
      <Legend />

      {Object.keys(sumData[0] || {}).map((key, i) => {
        if (key === 'date') return null;
        return <Bar dataKey={key} fill={[colors[6], colors[0]][i]} />;
      })}
    </BarChart>
  );
  const barChart = (
    <BarChart data={countersData}>
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip
        cursor={{ fill: '#FFFFFFAA' }}
        content={({ payload }) => <CustomTooltip payload={payload} />}
      />
      <XAxis dataKey="date" tickFormatter={DateFormatter('dd.MM.yy')} />
      <Legend />
      {Object.keys(data[0] || {}).map((key, i) => {
        if (key === 'date') return null;
        return <Bar dataKey={key} fill={colors[i]} />;
      })}
    </BarChart>
  );
  const barChartDaily = (
    <BarChart data={countersDataDays}>
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip
        cursor={{ fill: '#FFFFFFAA' }}
        content={({ payload }) => <CustomTooltip payload={payload} />}
      />
      <XAxis dataKey="date" tickFormatter={DateFormatter('dd.MM.yy')} />
      <Legend />
      {Object.keys(dataDays.reduce((acc, cur) => ({ ...acc, ...cur }), {})).map(
        (key, i) => {
          if (key === 'date') return null;
          return <Bar dataKey={key} fill={colors[i]} />;
        }
      )}
    </BarChart>
  );
  return (
    <>
      <Container maxWidth="xl">
        {error && <Alert severity="error">{error.message}</Alert>}
        {countersData?.length && (
          <>
            <Typography variant="h2" component="h2" gutterBottom>
              Counter
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              {barChart}
            </ResponsiveContainer>
          </>
        )}
        {/* TODO: Refactor to be more generic */}
        {countersDataDays?.length && (
          <>
            <Typography variant="h2" component="h2" gutterBottom>
              Daily Counters
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              {barChartDaily}
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={250}>
              {countersLineChart}
            </ResponsiveContainer>
          </>
        )}

        {lastWeek?.length && (
          <>
            <Typography variant="h2" component="h2" gutterBottom>
              Burndown
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              {burndownChart}
            </ResponsiveContainer>
          </>
        )}
        {expenseData && (
          <>
            <Typography variant="h2" component="h2" gutterBottom>
              Expenses (Individual)
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              {expenseChart}
            </ResponsiveContainer>
            <Box sx={{ display: 'flex' }}>
              {pieData.length &&
                expensePieChart.slice(-3).map((chart, i) => {
                  return (
                    <div style={{ flex: 1 }}>
                      <Typography variant="h3" component="h3" gutterBottom>
                        {format(+months[i], 'MMMM')}
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        {chart}
                      </ResponsiveContainer>
                    </div>
                  );
                })}
            </Box>
          </>
        )}
        {expenseData && (
          <>
            <Typography variant="h2" component="h2" gutterBottom>
              Expenses (summed)
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              {sumChart}
            </ResponsiveContainer>
          </>
        )}
        {itemData && (
          <>
            <Typography variant="h2" component="h2" gutterBottom>
              Stats
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              {itemChart}
            </ResponsiveContainer>
          </>
        )}
      </Container>
    </>
  );
};
const expensesToLine = (data) => {};
const CustomTooltip = ({
  active,
  payload,
}: {
  active?: null | string;
  payload?: any;
}) => {
  return (
    <Paper
      className="noFocus"
      elevation={1}
      sx={{
        background: '#FFFFFFAA',
        backdropFilter: 'blur(2px);',
        '&:hover': {
          background: '#000',
        },
        display: 'flex',
        maxWidth: '750px',
        flexWrap: 'wrap',
      }}
    >
      {Object.keys(payload?.[0]?.payload || {})
        .filter((key) => !['date'].includes(key))
        .filter((key) => (active ? key === active : true))
        .map((key, i, arr) => {
          return (
            <ListItem
              key={key}
              sx={{
                maxWidth:
                  arr.length > 20 ? '20%' : arr.length > 10 ? '33%' : '50%',
              }}
            >
              <ListItemText
                sx={{ my: 0, p: 0 }}
                primary={key}
                secondary={payload[0]?.payload[key]}
              />
            </ListItem>
          );
        })}
    </Paper>
  );
};
