import Sidebar from "../../components/layout/Sidebar";

function Health() {
  const reminders = [
    {
      title: "Amlodipine",
      time: "Tomorrow, 10:00 PM",
      type: "Medication",
      repeat: "Tomorrow",
      status: "upcoming",
    },
    {
      title: "Pantap-D",
      time: "Today, 11:00 AM",
      type: "Medication",
      repeat: "Tomorrow",
      status: "upcoming",
    },
    {
      title: "Pantoprazole",
      time: "Tomorrow, 17:30 PM",
      type: "Medication",
      repeat: "Tomorrow",
      status: "upcoming",
    },
  ];

  const completed = [];

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Sidebar />
      <div
        style={{
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
            Reminders
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Upcoming reminders for your health and daily routine.
          </p>
        </div>

        {/* Summary */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "15px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              border: "1px solid #f3f4f6",
              borderRadius: "10px",
              padding: "18px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#9ca3af",
              }}
            >
              Upcoming
            </p>

            <strong
              style={{
                display: "block",
                marginTop: "7px",
                fontSize: "24px",
                color: "#316942",
              }}
            >
              3
            </strong>

            <span
              style={{
                fontSize: "11px",
                color: "#9ca3af",
              }}
            >
              reminders scheduled
            </span>
          </div>

          <div
            style={{
              border: "1px solid #f3f4f6",
              borderRadius: "10px",
              padding: "18px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#9ca3af",
              }}
            >
              Today
            </p>

            <strong
              style={{
                display: "block",
                marginTop: "7px",
                fontSize: "24px",
                color: "#374151",
              }}
            >
              3
            </strong>

            <span
              style={{
                fontSize: "11px",
                color: "#9ca3af",
              }}
            >
              reminder remaining
            </span>
          </div>

          <div
            style={{
              border: "1px solid #f3f4f6",
              borderRadius: "10px",
              padding: "18px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#9ca3af",
              }}
            >
              Completed
            </p>

            <strong
              style={{
                display: "block",
                marginTop: "7px",
                fontSize: "24px",
                color: "#374151",
              }}
            >
              0
            </strong>

            <span
              style={{
                fontSize: "11px",
                color: "#9ca3af",
              }}
            >
              recently completed
            </span>
          </div>
        </div>

        {/* Upcoming reminders */}
        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "17px",
                fontWeight: 600,
                color: "#1f2937",
              }}
            >
              Upcoming
            </h2>

            <button
              style={{
                border: "1px solid #e5e7eb",
                background: "white",
                borderRadius: "7px",
                padding: "8px 13px",
                color: "#316942",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              + Add Reminder
            </button>
          </div>

          <div
            style={{
              border: "1px solid #f3f4f6",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            {reminders.map((reminder, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "17px 19px",
                  borderBottom:
                    index !== reminders.length - 1
                      ? "1px solid #f3f4f6"
                      : "none",
                }}
              >
                {/* Indicator */}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "9px",
                    background: "#f0fdf4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "15px",
                    color: "#316942",
                    fontSize: "15px",
                    flexShrink: 0,
                  }}
                >
                  {reminder.type === "Medication"
                    ? "M"
                    : reminder.type === "Appointment"
                      ? "A"
                      : "H"}
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    {reminder.title}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "5px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#9ca3af",
                      }}
                    >
                      {reminder.type}
                    </span>

                    <span
                      style={{
                        fontSize: "11px",
                        color: "#d1d5db",
                      }}
                    >
                      •
                    </span>

                    <span
                      style={{
                        fontSize: "11px",
                        color: "#9ca3af",
                      }}
                    >
                      {reminder.repeat}
                    </span>
                  </div>
                </div>

                {/* Time */}
                <div
                  style={{
                    textAlign: "right",
                    marginRight: "18px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    {reminder.time}
                  </div>

                  <div
                    style={{
                      marginTop: "4px",
                      fontSize: "10px",
                      color: "#9ca3af",
                    }}
                  >
                    Alarm enabled
                  </div>
                </div>

                {/* More button */}
                <button
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#9ca3af",
                    fontSize: "18px",
                    cursor: "pointer",
                    padding: "5px",
                  }}
                >
                  ⋮
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Completed */}
        <section style={{ marginTop: "30px" }}>
          <h2
            style={{
              margin: "0 0 15px",
              fontSize: "17px",
              fontWeight: 600,
              color: "#1f2937",
            }}
          >
            Recently Completed
          </h2>

          <div
            style={{
              border: "1px solid #f3f4f6",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            {completed.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "15px 19px",
                  borderBottom:
                    index !== completed.length - 1
                      ? "1px solid #f3f4f6"
                      : "none",
                  opacity: 0.7,
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#f0fdf4",
                    color: "#316942",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "13px",
                    fontSize: "13px",
                  }}
                >
                  ✓
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#4b5563",
                    }}
                  >
                    {item.title}
                  </div>

                  <div
                    style={{
                      marginTop: "3px",
                      fontSize: "11px",
                      color: "#9ca3af",
                    }}
                  >
                    {item.type}
                  </div>
                </div>

                <span
                  style={{
                    fontSize: "11px",
                    color: "#9ca3af",
                  }}
                >
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer note */}
        <div
          style={{
            marginTop: "30px",
            padding: "14px",
            borderRadius: "8px",
            background: "#f9fafb",
            color: "#9ca3af",
            fontSize: "11px",
            textAlign: "center",
          }}
        >
          Reminders will alert you at their scheduled time.
        </div>
      </div>
    </div>
  );
}

export default Health;
