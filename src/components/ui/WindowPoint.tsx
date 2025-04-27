const WindowPoint = () => {
  const row = ['bg-[#FF5F57]', 'bg-[#FEBC2E]', 'bg-[#28C840]'];

  return (
    <ul className="flex gap-x-2">
      {row.map((colorClass, index) => (
        <li key={index} className={`w-3 h-3 rounded-full ${colorClass}`}></li>
      ))}
    </ul>
  )
}

export default WindowPoint