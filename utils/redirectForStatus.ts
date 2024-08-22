import { UserStatus } from '@/generated/graphql';
import { GetServerSidePropsResult } from 'next';

export const redirectForStatus = (status: UserStatus): GetServerSidePropsResult<any> | undefined => {
    switch (status) {
        case UserStatus.Blocked:
            return {
                redirect: {
                    destination: '/account/blocked',
                    permanent: false,
                },
            };
        case UserStatus.OnboardingPending:
            return {
                redirect: {
                    destination: '/onboarding/user/intro',
                    permanent: false,
                },
            };
        case UserStatus.PaymentPending:
            return {
                redirect: {
                    destination: '/account/payment-pending',
                    permanent: false,
                },
            };
        case UserStatus.RestaurantOnboardingPending:
            return {
                redirect: {
                    destination: '/onboarding-restaurant/restaurant-welcome',
                    permanent: false,
                },
            };

    }
};
