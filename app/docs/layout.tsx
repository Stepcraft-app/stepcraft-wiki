import { Sidebar } from "@/components/navigation/sidebar"
import DisclaimerBanner from "@/components/navigation/disclaimer-banner"

export default function Documents({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex items-start">
      <Sidebar />
      <div className="flex-1 md:flex-[6] px-5 sm:px-8">
        <DisclaimerBanner />
        {children}
      </div>{" "}
    </div>
  )
}
