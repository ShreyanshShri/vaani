import Sidebar from "../../components/layout/Sidebar";

function Health() {
  const conversations = [
    {
      id: 1,
      title: "Amlodapine discussion",
      date: "Today, 8:00 AM",
      duration: "2 min",
      category: "Medication",
    },
    {
      id: 2,
      title: "Protein Options",
      date: "Today, 9:23 AM",
      duration: "5 min",
      category: "Medication",
    },
    {
      id: 3,
      title: "Soyabean Recipies",
      date: "Yesterday, 9:14 PM",
      duration: "1 min",
      category: "Medication",
    },
    // Add more conversations here as needed
  ];

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          minHeight: "100vh",
          background: "white",
          padding: "32px 40px",
          color: "#1f2937",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          style={{
            paddingBottom: "25px",
            borderBottom: "1px solid #f3f4f6",
            marginBottom: "28px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "25px",
              color: "#1f2937",
              fontWeight: 600,
            }}
          >
            History
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Your previous conversations with the digital nurse.
          </p>
        </div>

        {/* Conversations List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {conversations.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #f3f4f6",
                borderRadius: "11px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "18px 20px",
                  background: "#fafafa",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    {item.title}
                  </h2>

                  <p
                    style={{
                      margin: "5px 0 0",
                      fontSize: "11px",
                      color: "#9ca3af",
                    }}
                  >
                    {item.date} · {item.duration}
                  </p>
                </div>

                <span
                  style={{
                    padding: "5px 9px",
                    borderRadius: "5px",
                    background: "#f0fdf4",
                    color: "#316942",
                    fontSize: "11px",
                  }}
                >
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Health;
