import React from 'react';
import PropTypes from 'prop-types';

import ApplicationBar from '../../containers/ApplicationBar';
import TradeDetail from '../TradeDetail/TradeDetail';
import ContentContainer from '../ContentContainer/ContentContainer';

export default class TradeDetailPage extends React.Component {

    constructor(props) {
        super(props);

        this.intervalId = null;
    }

    static propTypes = {
        acceptTrade: PropTypes.func.isRequired,
        checkForUpdatedTrade: PropTypes.func,
        declineTrade: PropTypes.func.isRequired,
        deleted: PropTypes.bool.isRequired,
        deleteTrade: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        loadTrade: PropTypes.func.isRequired,
        newVersionAvailable: PropTypes.bool.isRequired,
        notFound: PropTypes.bool.isRequired,
        pollingInterval: PropTypes.number.isRequired,
        setDelivered: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
        submitTrade: PropTypes.func.isRequired,
        trade: PropTypes.object,
        user: PropTypes.object.isRequired,
        withdrawTrade: PropTypes.func.isRequired
    };

    static defaultProps = {
        deleted: false,
        loading: false,
        newVersionAvailable: false,
        notFound: false
    };

    componentDidMount() {
        const { tradeId } = this.props.match.params;
        this.loadTrade(tradeId);
    }

    componentWillUnmount() {
        this.stopIntervalTimer();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.deleted) {
            this.props.history.push(`/user/${this.props.user._id}/trades`);
        }

        if (nextProps.trade && (nextProps.trade !== this.props.trade) && !nextProps.newVersionAvailable) {
            this.startIntervalTimer(nextProps.trade);
        }

        if (nextProps.newVersionAvailable) {
            this.stopIntervalTimer();
        }
    }

    loadTrade(tradeId) {
        this.stopIntervalTimer();
        this.props.loadTrade(tradeId);
    }

    startIntervalTimer(trade) {
        if (typeof this.props.checkForUpdatedTrade === 'function') {
            if (trade.watchForUpdates) {
                this.intervalId = setInterval(() => { this.props.checkForUpdatedTrade(); }, this.props.pollingInterval);
            }
        }
    }

    stopIntervalTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    handleAcceptTrade = () => {
        this.stopIntervalTimer();
        this.props.acceptTrade();
    };

    handleDeclineTrade = () => {
        this.stopIntervalTimer();
        this.props.declineTrade();
    };

    handleDeleteTrade = () => {
        this.stopIntervalTimer();
        this.props.deleteTrade();
    };

    handleRefresh = () => {
        this.loadTrade(this.props.trade._id);
    };

    handleSetDelivered = () => {
        this.stopIntervalTimer();
        this.props.setDelivered();
    };

    handleSubmitTrade = () => {
        this.stopIntervalTimer();
        this.props.submitTrade();
    };

    handleWithdrawTrade = () => {
        this.stopIntervalTimer();
        this.props.withdrawTrade();
    };

    render() {
        return (
            <div>
                <ApplicationBar subtitle="Tauschgeschäft verwalten"/>
                <ContentContainer>
                    {this.props.trade &&
                        <TradeDetail
                            history={this.props.history}
                            newVersionAvailable={this.props.newVersionAvailable}
                            onAcceptTrade={this.handleAcceptTrade}
                            onDeclineTrade={this.handleDeclineTrade}
                            onDeleteTrade={this.handleDeleteTrade}
                            onRefresh={this.handleRefresh}
                            onSetDelivered={this.handleSetDelivered}
                            onSubmitTrade={this.handleSubmitTrade}
                            onWithdrawTrade={this.handleWithdrawTrade}
                            trade={this.props.trade}
                            user={this.props.user}
                        />
                    }
                </ContentContainer>
            </div>
        );
    }
}
