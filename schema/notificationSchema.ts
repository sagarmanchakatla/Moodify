import { SimilarUser } from "."

export type NotificationsPlayloadSchema = {
    to: string,
    title: string,
    body: string,
    data: {}
}

export type NotificationSchema = {
    id: string,
    created_at: string,
    body: string,
    title: string,
    user: string,
    image: string
}

export type SocialTabType = {
    users: SimilarUser[],
    friends: string[],
    invites: string[]
}
