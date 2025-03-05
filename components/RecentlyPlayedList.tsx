import { View } from "react-native"
import DashBoardCard from "./DashBoardCard"
import icons from "@/constants/icons"
import { RecentlyPlayedListSchema } from "@/schema/index"


interface RecentlyPlayedListProps{
    icon? : any,
    items : RecentlyPlayedListSchema[]
}

const RecentlyPlayedList: React.FC<RecentlyPlayedListProps> = ({ items,icon }) => {
    return (
        <View className='flex flex-col w-full justify-center items-center'>
            {items.map((item, index) => (
                <DashBoardCard extraStyle='m-1' key={index}>
                    <DashBoardCard.BigIcon icon={item.avatar} />
                    <DashBoardCard.Content title={item.name} secondartText={item.time} />
                    <DashBoardCard.SmallIcon icon={icon || icons.more} />
                </DashBoardCard>
            ))}
        </View>
    )
}

export default RecentlyPlayedList