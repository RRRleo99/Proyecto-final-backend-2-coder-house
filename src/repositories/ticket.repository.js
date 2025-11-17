import TicketModel from '../dao/models/ticket.model.js';

class TicketRepository {
  async create(ticketData) {
    return await TicketModel.create(ticketData);
  }

  async getByCode(code) {
    return await TicketModel.findOne({ code });
  }


}

export default TicketRepository;