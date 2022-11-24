import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { RoutePath } from '../constants';
import { useAuthorization } from '../hooks/useAuthorization';

interface Props {
  component: React.ComponentType;
  path?: string;
}

export default function RestrictedRoute({ component: RouteComponent }: Props): React.ReactElement {
  const isAuthenticated = useAuthorization();

  if (isAuthenticated === undefined) return <></>;
  return isAuthenticated === true ? <Navigate to={RoutePath.LOG} /> : <RouteComponent />;
}
