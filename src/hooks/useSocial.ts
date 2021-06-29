import {Share} from 'react-native';

const useSocial = () => {
  const onShare = async (message?: string) => {
    try {
      const result = await Share.share({
        message: message ?? 'Share with',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      throw error;
    }
  };
  return {
    onShare,
  };
};

export default useSocial;
