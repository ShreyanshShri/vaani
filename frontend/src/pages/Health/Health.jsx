import Sidebar from "../../components/layout/Sidebar";

function Health() {
  const vitals = [
    {
      label: "Blood Pressure",
      value: "118 / 76",
      unit: "mmHg",
      status: "Normal",
    },
    { label: "Heart Rate", value: "72", unit: "bpm", status: "Normal" },
    { label: "Temperature", value: "98.4", unit: "°F", status: "Normal" },
    { label: "Blood Oxygen", value: "98", unit: "%", status: "Normal" },
  ];

  const medications = [
    {
      name: "Amlodipine",
      dosage: "5 mg",
      schedule: "Once daily",
      next: "Tomorrow, 8:00 AM",
    },
    {
      name: "Paracetamol",
      dosage: "1000 IU",
      schedule: "Once daily",
      next: "Today, 8:00 AM",
    },
    {
      name: "Pantoprazole",
      dosage: "40 mg",
      schedule: "Before breakfast",
      next: "Tomorrow, 7:30 AM",
    },
  ];

  const activity = [
    {
      date: "Today, 10:42 AM",
      title: "Blood pressure recorded",
      description: "118 / 76 mmHg · Heart rate 72 bpm",
    },
    {
      date: "Today, 8:15 AM",
      title: "Medication taken",
      description: "Amlodipine 5 mg",
    },
    {
      date: "Yesterday, 9:30 PM",
      title: "Health check-in",
      description: "Reported feeling normal with no new symptoms",
    },
    {
      date: "Aug 8, 7:50 PM",
      title: "Temperature recorded",
      description: "98.4°F · No fever detected",
    },
  ];

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
          background: "#fff",
          color: "#1f2937",
          padding: "32px 40px",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          style={{
            borderBottom: "1px solid #f3f4f6",
            paddingBottom: "25px",
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
            My Health
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            A quick overview of your recent health information.
          </p>
        </div>

        {/* Health status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 22px",
            background: "#f0fdf4",
            border: "1px solid #dcfce7",
            borderRadius: "12px",
            marginBottom: "25px",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                marginBottom: "6px",
              }}
            >
              <div
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  background: "#316942",
                }}
              />

              <span
                style={{
                  color: "#316942",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Health status looks good
              </span>
            </div>

            <p
              style={{
                margin: 0,
                color: "#6b7280",
                fontSize: "13px",
              }}
            >
              Your latest recorded vitals are within the normal range.
            </p>
          </div>

          <span
            style={{
              fontSize: "12px",
              color: "#9ca3af",
            }}
          >
            Last updated 10:42 AM
          </span>
        </div>

        {/* Vitals */}
        <section style={{ marginBottom: "30px" }}>
          <h2
            style={{
              margin: "0 0 15px",
              fontSize: "17px",
              fontWeight: 600,
              color: "#1f2937",
            }}
          >
            Recent Vitals
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "15px",
            }}
          >
            {vitals.map((vital) => (
              <div
                key={vital.label}
                style={{
                  border: "1px solid #f3f4f6",
                  borderRadius: "10px",
                  padding: "19px",
                  background: "#fff",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "#9ca3af",
                  }}
                >
                  {vital.label}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "5px",
                    marginTop: "9px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "23px",
                      fontWeight: 600,
                      color: "#1f2937",
                    }}
                  >
                    {vital.value}
                  </span>

                  <span
                    style={{
                      fontSize: "11px",
                      color: "#9ca3af",
                    }}
                  >
                    {vital.unit}
                  </span>
                </div>

                <span
                  style={{
                    display: "inline-block",
                    marginTop: "9px",
                    padding: "4px 8px",
                    borderRadius: "5px",
                    background: "#f0fdf4",
                    color: "#316942",
                    fontSize: "11px",
                  }}
                >
                  {vital.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 1fr",
            gap: "25px",
          }}
        >
          {/* Medications */}
          <section>
            <h2
              style={{
                margin: "0 0 15px",
                fontSize: "17px",
                fontWeight: 600,
                color: "#1f2937",
              }}
            >
              Current Medications
            </h2>

            <div
              style={{
                border: "1px solid #f3f4f6",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              {medications.map((medication, index) => (
                <div
                  key={medication.name}
                  style={{
                    padding: "17px 19px",
                    borderBottom:
                      index !== medications.length - 1
                        ? "1px solid #f3f4f6"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        {medication.name}
                      </h3>

                      <p
                        style={{
                          margin: "5px 0 0",
                          fontSize: "12px",
                          color: "#9ca3af",
                        }}
                      >
                        {medication.dosage} · {medication.schedule}
                      </p>
                    </div>

                    <span
                      style={{
                        fontSize: "11px",
                        color: "#6b7280",
                        background: "#f9fafb",
                        padding: "5px 8px",
                        borderRadius: "5px",
                      }}
                    >
                      Next: {medication.next}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Health summary */}
          <section>
            <h2
              style={{
                margin: "0 0 15px",
                fontSize: "17px",
                fontWeight: 600,
                color: "#1f2937",
              }}
            >
              Health Summary
            </h2>

            <div
              style={{
                border: "1px solid #f3f4f6",
                borderRadius: "10px",
                padding: "19px",
              }}
            >
              <div style={{ marginBottom: "18px" }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "#9ca3af",
                  }}
                >
                  This week
                </p>

                <p
                  style={{
                    margin: "7px 0 0",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    color: "#4b5563",
                  }}
                >
                  Overall health has remained stable. No significant symptoms or
                  changes have been reported in recent check-ins.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    background: "#f9fafb",
                    borderRadius: "8px",
                    padding: "13px",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: "11px",
                      color: "#9ca3af",
                    }}
                  >
                    Check-ins
                  </span>

                  <strong
                    style={{
                      display: "block",
                      marginTop: "4px",
                      fontSize: "18px",
                      color: "#374151",
                    }}
                  >
                    6
                  </strong>
                </div>

                <div
                  style={{
                    background: "#f9fafb",
                    borderRadius: "8px",
                    padding: "13px",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: "11px",
                      color: "#9ca3af",
                    }}
                  >
                    Medications
                  </span>

                  <strong
                    style={{
                      display: "block",
                      marginTop: "4px",
                      fontSize: "18px",
                      color: "#374151",
                    }}
                  >
                    3
                  </strong>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Recent activity */}
        <section style={{ marginTop: "30px" }}>
          <h2
            style={{
              margin: "0 0 15px",
              fontSize: "17px",
              fontWeight: 600,
              color: "#1f2937",
            }}
          >
            Recent Activity
          </h2>

          <div
            style={{
              border: "1px solid #f3f4f6",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            {activity.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "16px",
                  padding: "16px 19px",
                  borderBottom:
                    index !== activity.length - 1
                      ? "1px solid #f3f4f6"
                      : "none",
                }}
              >
                <div
                  style={{
                    width: "7px",
                    height: "7px",
                    marginTop: "6px",
                    flexShrink: 0,
                    borderRadius: "50%",
                    background: "#316942",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "15px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      {item.title}
                    </span>

                    <span
                      style={{
                        fontSize: "11px",
                        color: "#9ca3af",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.date}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "12px",
                      color: "#9ca3af",
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div
          style={{
            marginTop: "30px",
            paddingTop: "15px",
            borderTop: "1px solid #f3f4f6",
            textAlign: "center",
            color: "#9ca3af",
            fontSize: "11px",
          }}
        >
          Health information is based on your recorded data.
        </div>
      </div>
    </div>
  );
}

export default Health;
