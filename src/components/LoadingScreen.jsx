export default function LoadingScreen({ text = 'Nalagam ...' }) {
  return (
    <div className="loading-screen">
      <div className="spinner-border text-primary" role="status" aria-hidden="true" />
      <span>{text}</span>
    </div>
  )
}
