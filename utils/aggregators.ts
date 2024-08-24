import {
  IntegrationConnectionStatusEnum,
  IntegrationPlatformEnum,
} from "@/generated/graphql";

export interface Aggregator {
  imageUrl: string;
  platform: IntegrationPlatformEnum;
  connectionStatus: IntegrationConnectionStatusEnum;
  loading: boolean;
  handleConnect: () => void;
  handleDisconnect: () => void;
  handleContactSupport: () => void;
}

const CLOVER_ICON =
  "https://res.cloudinary.com/choose-pos/image/upload/v1724443478/clover_nrphcv.svg";
const UBER_EATS_ICON =
  "https://res.cloudinary.com/choose-pos/image/upload/v1724443795/uber-eats_ykeaxi.svg";
const DOOR_DASH_ICON =
  "https://res.cloudinary.com/choose-pos/image/upload/v1724445584/door-dash_nt7btd.svg";
const GRUB_HUB_ICON =
  "https://res.cloudinary.com/choose-pos/image/upload/v1724445584/grub-hub_by4euz.svg";

export const formatAggregatorPlatform = (type: IntegrationPlatformEnum) => {
  switch (type) {
    case IntegrationPlatformEnum.Clover:
      return "Clover";
    case IntegrationPlatformEnum.DoorDash:
      return "Door Dash";
    case IntegrationPlatformEnum.GrubHub:
      return "Grub Hub";
    case IntegrationPlatformEnum.UberEats:
      return "Uber Eats";

    default:
      return "";
  }
};

export const formatAggregatorConnection = (
  type: IntegrationConnectionStatusEnum
) => {
  switch (type) {
    case IntegrationConnectionStatusEnum.Connected:
      return "Connected";
    case IntegrationConnectionStatusEnum.Error:
      return "Error";
    case IntegrationConnectionStatusEnum.Expired:
      return "Expired";
    case IntegrationConnectionStatusEnum.NotConnected:
      return "Not Connected";

    default:
      return "";
  }
};

export const aggregatorList: Aggregator[] = [
  {
    platform: IntegrationPlatformEnum.Clover,
    connectionStatus: IntegrationConnectionStatusEnum.NotConnected,
    imageUrl: CLOVER_ICON,
    loading: false,
    handleConnect: () => {
      // const redirectUri = encodeURIComponent(
      //   `${APP_DOMAIN}/clover-connection?fromAggregator=true`
      // );
      // window.location.href = `${CLOVER_ENDPOINT}/oauth/v2/authorize?client_id=${CLOVER_APP_ID}&redirect_uri=${redirectUri}`;
    },
    handleDisconnect: () => {
      // try {
      //   await sdk.DisconnectCloverConnection();
      // } catch (error) {
      //   const errMessage = extractErrorMessage(error);
      //   if (errMessage) {
      //   }
      // }
    },
    handleContactSupport: () => {},
  },
  {
    platform: IntegrationPlatformEnum.UberEats,
    connectionStatus: IntegrationConnectionStatusEnum.NotConnected,
    imageUrl: UBER_EATS_ICON,
    loading: false,
    handleConnect: () => {},
    handleDisconnect: () => {},
    handleContactSupport: () => {},
  },
  {
    platform: IntegrationPlatformEnum.DoorDash,
    connectionStatus: IntegrationConnectionStatusEnum.NotConnected,
    imageUrl: DOOR_DASH_ICON,
    loading: false,
    handleConnect: () => {},
    handleDisconnect: () => {},
    handleContactSupport: () => {},
  },
  {
    platform: IntegrationPlatformEnum.GrubHub,
    connectionStatus: IntegrationConnectionStatusEnum.NotConnected,
    imageUrl: GRUB_HUB_ICON,
    loading: false,
    handleConnect: () => {},
    handleDisconnect: () => {},
    handleContactSupport: () => {},
  },
];
