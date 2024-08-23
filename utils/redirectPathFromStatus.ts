import { UserStatus } from '@/generated/graphql';
import { GetServerSidePropsResult } from 'next';

export const redirectPathFromStatus = (status: UserStatus): GetServerSidePropsResult<any> => {
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
        case UserStatus.InternalVerificationPending:
            return {
                redirect: {
                    destination: '/account/verification-pending',
                    permanent: false,
                },
            };

        case UserStatus.Active:
            return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            }

        default: return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        }


    }
};
