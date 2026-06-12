import { getApiBaseUrl } from '@/config/env';
import { ApiError } from '@/services/api/client';
import { getAccessToken } from '@/services/api/session';

import { buildReportQuery } from './reportService';
import type { ReportFilters } from './types';

function parseErrorMessage(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    return 'Não foi possível exportar o relatório.';
  }

  const error = (payload as { error?: unknown }).error;

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string') return message;
  }

  return 'Não foi possível exportar o relatório.';
}

export async function fetchReportPdfBuffer(filters: ReportFilters): Promise<ArrayBuffer> {
  const accessToken = await getAccessToken();
  const baseUrl = getApiBaseUrl().replace(/\/$/, '');
  const query = buildReportQuery(filters);
  const pdfUrl = `${baseUrl}/reports/reports.pdf${query}`;

  const response = await fetch(pdfUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/pdf',
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new ApiError(response.status, parseErrorMessage(payload));
  }

  return response.arrayBuffer();
}
