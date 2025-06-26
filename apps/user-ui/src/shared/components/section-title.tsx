import TitleBorder from "../../assets/svg/title-border"

const SectionTitle = ({ title } : { title : string }) => {
  return (
    <div className="relative">
        <h1 className="text-xl md:text-3xl relative z-10 font-semibold">{title}</h1>
        <TitleBorder className="absolute top-[46%]" />
    </div>
  )
}

export default SectionTitle