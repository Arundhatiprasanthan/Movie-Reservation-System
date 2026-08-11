import "./AdminTabs.css";

function AdminTabs({
  activeTab,

  setActiveTab,
}) {
  const tabs = ["Overview", "Movies", "Theaters", "Showtimes"];

  return (
    <div className="admin-tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={activeTab === tab ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default AdminTabs;
