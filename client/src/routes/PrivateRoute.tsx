import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthorization } from '../hooks/useAuthorization';

interface Props {
  component: React.ComponentType;
  path?: string;
}

export default function PrivateRoute({ component: RouteComponent }: Props): React.ReactElement {
  const isAuthenticated = useAuthorization();

  if (isAuthenticated === undefined) return <></>;
  return isAuthenticated === false ? <Navigate to="/" /> : <RouteComponent />;
}
