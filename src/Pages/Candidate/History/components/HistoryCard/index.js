import { HISTORY_REQUESTER } from "utils/enums/history-requester";
import formatDate from "utils/format-date";

export default function HistoryCard({
    history
}) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            border: '2px solid #1F4B73', borderRadius: '8px', minWidth: 'min(100%,400px)',
            height: '140px', padding: '16px', justifyContent: 'space-between',
            alignSelf: history.createdBy === "Candidate" ? "end" : "start"
        }}>
            <h4>{HISTORY_REQUESTER[history.createdBy]}</h4>
            <span style={{ fontSize: '14px' }}>{history.description}</span>
            <span>{formatDate(history.createdAt, true)}</span>
        </div>
    )
}