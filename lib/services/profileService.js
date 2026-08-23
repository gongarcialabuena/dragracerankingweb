import { profileApiClient } from '../client/profile/profileApiClient'

export const profileService = {
    async getProfileData() {
        return await profileApiClient.get()
    },
}