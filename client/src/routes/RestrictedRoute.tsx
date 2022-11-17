import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthorization } from '../hooks/useAuthorization';

interface Props {
  component: React.ComponentType;
  path?: string;
}

export default function RestrictedRoute({ component: RouteComponent }: Props): React.ReactElement {
  const isAuthenticated = useAuthorization();

  if (isAuthenticated === undefined) return <></>;
  return isAuthenticated === true ? <Navigate to="/main" /> : <RouteComponent />;
}
