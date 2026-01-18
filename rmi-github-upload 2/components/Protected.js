import React from 'react';
import { useUser } from '../contexts/UserContext';

/**
 * AdminOnly - Only renders children if user is admin
 * Usage: <AdminOnly><Button /></AdminOnly>
 */
export function AdminOnly({ children }) {
  const { isAdmin } = useUser();
  
  if (!isAdmin()) {
    return null;
  }
  
  return <>{children}</>;
}

/**
 * TradeOnly - Only renders children if user is a trade worker
 * Usage: <TradeOnly><TaskList /></TradeOnly>
 */
export function TradeOnly({ children }) {
  const { isTrade } = useUser();
  
  if (!isTrade()) {
    return null;
  }
  
  return <>{children}</>;
}

/**
 * RoleRequired - Only renders children if user has required role(s)
 * Usage: <RoleRequired roles={['admin', 'trade-painter']}><Component /></RoleRequired>
 */
export function RoleRequired({ roles, children }) {
  const { hasRole } = useUser();
  
  if (!hasRole(roles)) {
    return null;
  }
  
  return <>{children}</>;
}

/**
 * Protected - Renders different content based on user role
 * Usage:
 * <Protected
 *   admin={<AdminDashboard />}
 *   trade={<TradeDashboard />}
 *   fallback={<Loading />}
 * />
 */
export function Protected({ admin, trade, fallback }) {
  const { isAdmin, isTrade } = useUser();
  
  if (isAdmin()) {
    return <>{admin}</>;
  }
  
  if (isTrade()) {
    return <>{trade}</>;
  }
  
  return fallback ? <>{fallback}</> : null;
}

export default {
  AdminOnly,
  TradeOnly,
  RoleRequired,
  Protected,
};
