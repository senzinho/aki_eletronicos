'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '../../../../components/admin/PageHeader';
import { DataTable } from '../../../../components/admin/DataTable';
import { Badge } from '../../../../components/ui/Badge';
import { serviceRequests } from '../../../../lib/api';
import type { ServiceRequest, ServiceRequestStatus } from '../../../../lib/types';

const STATUS_LABEL: Record<ServiceRequestStatus, string> = {
  novo: 'Novo',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
};

const STATUS_TONE: Record<ServiceRequestStatus, 'green' | 'warning' | 'neutral'> = {
  novo: 'warning',
  em_andamento: 'green',
  concluido: 'neutral',
};

export default function SolicitacoesPage() {
  const [items, setItems] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setItems(await serviceRequests.list());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: number, status: ServiceRequestStatus) {
    await serviceRequests.updateStatus(id, status);
    load();
  }

  return (
    <div>
      <PageHeader title="Solicitações" description="Formulários de contato e orçamento de reparo enviados pelo site." />

      {!loading && (
        <DataTable
          columns={[
            { header: 'Tipo', render: (r) => (r.type === 'reparo' ? 'Reparo' : 'Contato') },
            { header: 'Nome', render: (r) => r.name },
            { header: 'Telefone', render: (r) => r.phone },
            { header: 'Detalhes', render: (r) => (
              <span className="text-text-muted text-xs">
                {r.deviceModel && <>Aparelho: {r.deviceModel}<br /></>}
                {r.problemType && <>Problema: {r.problemType}<br /></>}
                {r.message}
              </span>
            ) },
            { header: 'Recebido em', render: (r) => new Date(r.createdAt).toLocaleString('pt-BR') },
            {
              header: 'Status',
              render: (r) => (
                <div className="flex items-center gap-2">
                  <Badge tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</Badge>
                  <select
                    value={r.status}
                    onChange={(e) => updateStatus(r.id, e.target.value as ServiceRequestStatus)}
                    className="rounded-lg border border-border bg-surface-1 px-2 py-1 text-xs text-text"
                  >
                    {Object.entries(STATUS_LABEL).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              ),
            },
          ]}
          rows={items}
          rowKey={(r) => r.id}
          emptyMessage="Nenhuma solicitação recebida ainda."
        />
      )}
    </div>
  );
}
