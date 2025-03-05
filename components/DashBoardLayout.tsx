    import { ScrollView, View } from 'react-native'
    import React, { ReactNode, useState } from 'react'
    import NavigationButtons from './NavigationButtons'

    interface DashBoardLayoutSchema {
        children: ReactNode
    }

    export default function DashBoardLayout({ children }: DashBoardLayoutSchema) {

        return (
            <View className="flex-1">
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingBottom : 60 
                    }}
                >
                    {children}
                </ScrollView>
            </View>
        )
    }