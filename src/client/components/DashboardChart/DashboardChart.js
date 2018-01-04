import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Legend, Tooltip } from 'recharts';

import Paper from 'material-ui/Paper';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

import Placeholder from '../../containers/Placeholder';

import './DashboardChart.css';

const toolbarStyle = { width: '100%' };
const toolbarTitleStyle = { color: 'black' };

export default class DashboardChart extends React.Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired,
        placeholderText: PropTypes.string.isRequired,
        placeholderLoadingText: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired
    };

    render() {
        const { title, data, placeholderText, placeholderLoadingText, loading } = this.props;
        const countAll = data.reduce((sum, item) => sum + item.value, 0);

        return (
            <Paper className="dashboard-chart">
                <Toolbar style={toolbarStyle}>
                    <ToolbarGroup>
                        <ToolbarTitle style={toolbarTitleStyle} text={`${title} (${countAll})`}/>
                    </ToolbarGroup>
                </Toolbar>
                {countAll > 0 ? (
                    <PieChart width={450} height={400}>
                        <Pie dataKey="value" data={data} innerRadius={20} outerRadius={120} isAnimationActive label/>
                        <Tooltip/>
                        <Legend/>
                    </PieChart>
                ) : (
                    <Placeholder width={450} height={343} loading={loading} text={placeholderText} loadingText={placeholderLoadingText}/>
                )}
            </Paper>
        );
    }
}
