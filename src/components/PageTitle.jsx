export default function PageTitle({ title, subtitle, action }) {
  return (
    <div className="page-title-row">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
