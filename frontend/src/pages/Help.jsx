import Layout from "../components/Layout.jsx";

const faqs = [
  {
    q: "How do I invite someone?",
    a: "Share the referral ID shown in the sidebar. When they type it while opening an account, they join your team.",
  },
  {
    q: "When does my balance grow?",
    a: "A member you introduced pays the joining fee. Your share of that fee is credited to your balance and appears in the wallet history.",
  },
  {
    q: "How far does commission travel?",
    a: "Three levels. The direct sponsor earns the largest share, then the sponsor above them, then one more.",
  },
  {
    q: "How long does a withdrawal take?",
    a: "An admin reviews each request. Until it is approved, the amount stays locked and is shown as pending in the wallet.",
  },
  {
    q: "I forgot my password.",
    a: "Raise a ticket from the Support page with the email you registered. An admin will reset it for you.",
  },
];

export default function Help() {
  return (
    <Layout title="Help">
      <div className="panel wide-panel">
        {faqs.map((f) => (
          <details key={f.q} className="faq">
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </Layout>
  );
}
