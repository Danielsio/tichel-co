import { formatPrice } from "@/lib/utils/format-price";

interface OrderItem {
  name: string;
  quantity: number;
  priceCents: number;
}

interface OrderConfirmationProps {
  orderId: string;
  items: OrderItem[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
}

export function OrderConfirmationEmail({
  orderId,
  items,
  subtotalCents,
  shippingCents,
  taxCents,
  totalCents,
}: OrderConfirmationProps) {
  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "Heebo, Arial, sans-serif",
        maxWidth: 600,
        margin: "0 auto",
        padding: 24,
        backgroundColor: "#FAF8F4",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: 28,
            color: "#1A2744",
            margin: 0,
          }}
        >
          Tichel & Co.
        </h1>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 4,
          padding: 24,
          border: "1px solid #F0EDE8",
        }}
      >
        <h2
          style={{
            fontSize: 20,
            color: "#1A2744",
            marginTop: 0,
          }}
        >
          ההזמנה שלך אושרה!
        </h2>
        <p style={{ color: "#2C2C2C", opacity: 0.6, fontSize: 14 }}>
          מספר הזמנה: #{orderId.slice(0, 8)}
        </p>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 16,
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "right",
                  borderBottom: "1px solid #F0EDE8",
                  paddingBottom: 8,
                  fontSize: 12,
                  color: "#2C2C2C",
                  opacity: 0.5,
                }}
              >
                פריט
              </th>
              <th
                style={{
                  textAlign: "center",
                  borderBottom: "1px solid #F0EDE8",
                  paddingBottom: 8,
                  fontSize: 12,
                  color: "#2C2C2C",
                  opacity: 0.5,
                }}
              >
                כמות
              </th>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #F0EDE8",
                  paddingBottom: 8,
                  fontSize: 12,
                  color: "#2C2C2C",
                  opacity: 0.5,
                }}
              >
                מחיר
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td
                  style={{
                    padding: "12px 0",
                    fontSize: 14,
                    color: "#1A2744",
                  }}
                >
                  {item.name}
                </td>
                <td
                  style={{
                    padding: "12px 0",
                    textAlign: "center",
                    fontSize: 14,
                  }}
                >
                  {item.quantity}
                </td>
                <td
                  style={{
                    padding: "12px 0",
                    textAlign: "left",
                    fontSize: 14,
                  }}
                >
                  {formatPrice(item.priceCents * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            borderTop: "1px solid #F0EDE8",
            marginTop: 16,
            paddingTop: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
              marginBottom: 8,
            }}
          >
            <span style={{ color: "#2C2C2C", opacity: 0.6 }}>סיכום ביניים</span>
            <span>{formatPrice(subtotalCents)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
              marginBottom: 8,
            }}
          >
            <span style={{ color: "#2C2C2C", opacity: 0.6 }}>משלוח</span>
            <span>{shippingCents === 0 ? "חינם" : formatPrice(shippingCents)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
              marginBottom: 8,
            }}
          >
            <span style={{ color: "#2C2C2C", opacity: 0.6 }}>מע״מ</span>
            <span>{formatPrice(taxCents)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 18,
              fontWeight: 600,
              color: "#1A2744",
              borderTop: "1px solid #F0EDE8",
              paddingTop: 12,
              marginTop: 8,
            }}
          >
            <span>סה״כ</span>
            <span>{formatPrice(totalCents)}</span>
          </div>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: 32,
          fontSize: 12,
          color: "#2C2C2C",
          opacity: 0.4,
        }}
      >
        <p>תודה שבחרת ב-Tichel & Co.</p>
        <p style={{ fontStyle: "italic" }}>נבנה בכוונה, לנשים שמכסות בכוונה</p>
      </div>
    </div>
  );
}
