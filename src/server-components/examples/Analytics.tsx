import { useComponent } from '@state-less/react-client';
import {
  Container,
  Alert,
  Typography,
  Box,
  Checkbox,
  Select,
  MenuItem as Option,
  useMediaQuery,
} from '@mui/material';
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
  endOfDay,
  format,
  getDate,
  getHours,
  getMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { CustomTooltip } from '../../components/charts/CustomTooltip';
import { colors } from '../../lib/colors';
import { DateFormatter } from '../../lib/analytics';

// const colors = [
//   '#9e0142',
//   '#d53e4f',
//   '#f46d43',
//   '#fdae61',
//   '#fee08b',
//   '#e6f598',
//   '#abdda4',
//   '#66c2a5',
//   '#3288bd',
//   '#5e4fa2',
//   'black',
// ];

// const colors = [
//   '#333333',
//   '#FF4136',
//   '#FF851B',
//   '#FFDC00',
//   '#45B69C',
//   '#4CAF50',
//   '#F012BE',
//   '#B10DC9',
//   '#85144b',
//   '#3D9970',
//   '#AAAAAA',
//   '#FF6347',
//   '#39CCCC',
//   '#7FDBFF',
//   '#F0DB4F',
//   '#001F3F',
//   '#0074E4',
//   '#00AEEF',
//   '#FFFFFF',
//   '#D3D3D3',

//   'black',
// ];

export const AnalyticsPage = (props) => {
  const [component, { loading, error, refetch }] = useComponent('my-lists', {});
  const [nDays, setNDays] = useState(7);
  const listNames = useMemo(
    () => component?.children?.map((list) => list.props.title) || [],
    [component?.children?.length]
  );
  const counterNames =
    component?.children
      ?.filter((list) => list.props.settings.defaultType === 'Counter')
      .map((list) => list.props.title) || [];
  const [listVisibility, setListVisibility] = useState({});

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

  const countersDays = component?.children
    .filter(
      (list) =>
        listVisibility[list.props.title] &&
        list.props.settings.defaultType === 'Counter'
    )
    .reduce((acc, list) => {
      const childs = list.children
        .filter((todo) => {
          const diff = differenceInDays(
            startOfDay(
              new Date(
                todo.props.lastModified ||
                  todo.props.createdAt ||
                  todo.props.archived ||
                  Date.now()
              )
            ),
            startOfDay(Date.now())
          );
          return 'count' in todo.props && Math.floor(diff) * -1 < nDays;
        })
        .reduce((acc, todo) => {
          /**
           * In most cases we use the date when an item has been archived.
           * If it's not archived yet it will be counted to the day it has been modified or created.
           */
          const analysisDate = new Date(
            todo.props.archived
              ? todo.props.archived
              : todo.props.lastModified || todo.props.createdAt || Date.now()
          );

          /* Counter items can be archived until end of the next day and still be counted towards the day before. */
          /* In order to show up at the correct day in the analysis we need to subtract 1 day from the archived date */
          if (
            getHours(analysisDate) >= 0 &&
            getHours(analysisDate) <=
              getHours(
                new Date(list.props.settings.endOfDay || endOfDay(analysisDate))
              ) &&
            todo.props.archived &&
            getDate(new Date(todo.props.createdAt)) <
              getDate(new Date(todo.props.archived))
          ) {
            analysisDate.setDate(analysisDate.getDate() - 1);
          }
          const date = startOfDay(analysisDate).getTime();
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

  const listTree = component?.children
    .filter((list) => list.props.settings.defaultType === 'Counter')
    .reduce((acc, list, i) => {
      return list.children.reduce((acc, todo, j) => {
        acc[list.props.title] = {
          ...(acc[list.props.title] || {}),
          [todo.props.title]: true,
        };
        return acc;
      }, acc);
    }, {});
  console.log('LIST TREE', listTree);
  const listMapping = Object.keys(listTree || {}).reduce((acc, list, i) => {
    return Object.keys(listTree[list]).reduce((acc, todo, j) => {
      acc[todo] = { i, j };
      return acc;
    }, acc);
  }, {});
  const [visibility, setVisibility] = useState({});

  useEffect(() => {
    setListVisibility(
      listNames?.reduce((acc, cur) => ({ ...acc, [cur]: true }), {})
    );
  }, [listNames]);

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
  const dataDaysLkp = dataDays.reduce((acc, cur) => ({ ...acc, ...cur }), {});
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
  const isSmall = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const [invert, setInvert] = useState(isSmall);
  const renderCustomLegend = ({ payload }) => {
    return (
      <div className="customized-legend">
        {payload.map((entry) => {
          const { dataKey, color } = entry;
          const active = visibility[dataKey.trim()] === false;
          const style = {
            marginRight: 10,
            color: (active && !invert) || (!active && invert) ? '#AAA' : '#000',
          };

          return (
            <span
              className="legend-item"
              onClick={(e) => {
                if (e.ctrlKey) {
                  setInvert(!invert);
                }
                setVisibility((visibility: Record<string, boolean>) => ({
                  ...Object.values(countersDays || {})?.reduce(
                    (acc: Record<string, boolean>, obj) => {
                      return Object.keys(obj || {})?.reduce((acc, key) => {
                        return {
                          ...acc,
                          [key]:
                            typeof acc[key] === 'undefined' ? true : acc[key],
                        };
                      }, acc);
                    },
                    visibility
                  ),
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
                {(active && !invert) ||
                  (!active && invert && (
                    <Symbols
                      cx={5}
                      cy={5}
                      type="circle"
                      size={25}
                      fill={'#FFF'}
                    />
                  ))}
              </Surface>
              <span>{dataKey.trim()}</span>
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
      )
        .filter((key) => {
          if (key === 'date') return false;
          return true;
        })
        .map((key, i) => {
          let visible = visibility[key] !== false;
          if (invert) visible = !visible;
          console.log('COLOR', key, listMapping);
          return (
            <Line
              strokeWidth={2}
              dataKey={visible ? key : ' ' + key}
              connectNulls
              stroke={
                colors[listMapping[key].j % colors?.length][listMapping[key].i]
              }
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
        return (
          <Line
            strokeWidth={2}
            dataKey={key}
            stroke={
              colors[i % colors.length][i % colors[i % colors.length].length]
            }
          />
        );
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
        return (
          <Bar
            dataKey={key}
            fill={
              colors[i % colors.length][i % colors[i % colors.length].length]
            }
          />
        );
      })}
    </BarChart>
  );
  const expensePieChart = pieData.map((pieData, j) => {
    return (
      <PieChart>
        <Legend />
        {
          <Pie
            data={pieData || []}
            dataKey={'value'}
            nameKey={'name'}
            fill={colors[j % colors.length][j % colors[j].length]}
            label
          >
            {(pieData || []).map((entry, i) => (
              <Cell
                fill={
                  colors[i % colors.length][
                    i % colors[i % colors.length].length
                  ]
                }
              />
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
        return (
          <Bar
            dataKey={key}
            fill={
              colors[i % colors.length][i % colors[i % colors.length].length]
            }
          />
        );
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
        return <Bar dataKey={key} fill={colors[i][0]} />;
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
        return (
          <Bar
            dataKey={key}
            fill={
              colors[i % colors.length][i % colors[i % colors.length].length]
            }
          />
        );
      })}
    </BarChart>
  );
  const barChartDaily = (
    <BarChart data={countersDataDays.slice(-1)}>
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip
        cursor={{ fill: '#FFFFFFAA' }}
        content={({ payload }) => <CustomTooltip payload={payload} />}
      />
      <XAxis dataKey="date" tickFormatter={DateFormatter('dd.MM.yy')} />
      <Legend />
      {Object.keys(dataDaysLkp).map((key, i) => {
        if (key === 'date') return null;
        if (dataDaysLkp[key] === 0) return null;
        return (
          <Bar
            dataKey={key}
            fill={
              colors[i % colors.length][i % colors[i % colors.length].length]
            }
          />
        );
      })}
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

        {(countersDataDays?.length ||
          counterNames.every((name) => !listVisibility[name])) && (
          <>
            <Typography variant="h2" component="h2" gutterBottom>
              Daily Counters
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {counterNames.map((listName) => {
                const checked = listVisibility[listName];
                return (
                  <div>
                    <Checkbox
                      color="secondary"
                      key={listName}
                      checked={Boolean(checked)}
                      onChange={(e) =>
                        setListVisibility({
                          ...listVisibility,
                          [listName]: e.target.checked,
                        })
                      }
                    />
                    {listName}
                  </div>
                );
              })}
              <Select
                sx={{ ml: 'auto' }}
                size="small"
                value={nDays}
                onChange={(e) => setNDays(Number(e.target.value))}
              >
                <Option value={1}>1 Days</Option>
                <Option value={2}>2 Days</Option>
                <Option value={5}>5 Days</Option>
                <Option value={7}>7 Days</Option>
                <Option value={14}>14 Days</Option>
                <Option value={30}>1 Month</Option>
                <Option value={90}>3 Month</Option>
              </Select>
            </Box>
            <ResponsiveContainer
              width="100%"
              height={window.innerHeight * (isSmall ? 0.8 : 0.68)}
            >
              {barChartDaily}
            </ResponsiveContainer>
            <ResponsiveContainer
              width="100%"
              height={window.innerHeight * (isSmall ? 0.8 : 0.68)}
            >
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
