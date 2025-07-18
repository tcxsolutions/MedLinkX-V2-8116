import { supabase } from '../lib/supabase';

const AUDIT_LOG_TABLE = 'audit_log_medlink_x7a9b2c3';

export const logAuditEvent = async ({
  actionType,
  tableName,
  recordId,
  changes,
  userId,
  request = null
}) => {
  try {
    const auditEntry = {
      action_type: actionType,
      table_name: tableName,
      record_id: recordId,
      changes,
      performed_by: userId,
      ip_address: request?.ip || null,
      user_agent: request?.headers?.['user-agent'] || null
    };

    const { data, error } = await supabase
      .from(AUDIT_LOG_TABLE)
      .insert([auditEntry]);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error logging audit event:', error);
    return { success: false, error: error.message };
  }
};

export const getAuditLog = async ({
  tableName = null,
  recordId = null,
  userId = null,
  startDate = null,
  endDate = null,
  limit = 50,
  offset = 0
}) => {
  try {
    let query = supabase
      .from(AUDIT_LOG_TABLE)
      .select('*')
      .order('performed_at', { ascending: false });

    if (tableName) query = query.eq('table_name', tableName);
    if (recordId) query = query.eq('record_id', recordId);
    if (userId) query = query.eq('performed_by', userId);
    if (startDate) query = query.gte('performed_at', startDate);
    if (endDate) query = query.lte('performed_at', endDate);

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      success: true,
      data,
      meta: {
        total: count,
        offset,
        limit
      }
    };
  } catch (error) {
    console.error('Error fetching audit log:', error);
    return { success: false, error: error.message };
  }
};