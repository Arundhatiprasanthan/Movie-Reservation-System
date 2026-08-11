import "./StatCard.css";

function StatCard({ title, value}) {
    return (
        <div className="stat-card">
            <div>
                <p className="stat-title">{title}</p>

                <h2>{value}</h2>
            </div>
        </div>
    );
}

export default StatCard;