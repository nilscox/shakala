import { DraftsGateway, ThreadDraftsComments } from '../gateways/drafts.gateway';
import { AbstractDraftsGateway } from '../utils/abstract-drafts-gateway';

export class StubDraftsGateway extends AbstractDraftsGateway implements DraftsGateway {
  private drafts = new Map<string, ThreadDraftsComments>();

  async getAllDrafts(): Promise<Record<string, ThreadDraftsComments>> {
    return Array.from(this.drafts.entries()).reduce<Record<string, ThreadDraftsComments>>(
      (obj, [key, value]) => ({ ...obj, [key]: value }),
      {},
    );
  }

  protected async save(threadId: string, drafts: ThreadDraftsComments): Promise<void> {
    this.drafts.set(threadId, drafts);
  }

  protected async delete(threadId: string): Promise<void> {
    this.drafts.delete(threadId);
  }
}
