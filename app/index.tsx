import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { hasUserProfile } from '@/services/userProfile';

export default function Index() {
  const [checked, setChecked] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    hasUserProfile().then((exists) => {
      setHasProfile(exists);
      setChecked(true);
    });
  }, []);

  if (!checked) {
    // Still loading — render nothing until we know
    return null;
  }

  if (!hasProfile) {
    return <Redirect href="/profile-create" />;
  }

  return <Redirect href="/scan" />;
}
