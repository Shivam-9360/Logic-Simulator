using Microsoft.AspNetCore.SignalR;

namespace CircuitSimulationWebAppMvc.Communication.Hubs
{
    public class CommunicationHub : Hub
    {
        private int SignalIn = 0;
        public List<string> DeviceIdList = new();
        
        public void SetSignalIn(int SignalIn)
        {
            this.SignalIn = SignalIn;
        }
        public int GetSignalIn()
        {
            return this.SignalIn;
        }

        public async Task SendInput(string id)
        {
            if (!DeviceIdList.Contains(id))
            {
                DeviceIdList.Add(id);
            }
            await Clients.All.SendAsync($"GetInput-{id}", SignalIn.ToString());
        }
    }
}
