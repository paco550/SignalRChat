const conexion = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

// Recibimos el mensaje del hub
conexion.on("GetMessage", (message) => {
    console.log(message)
    const li = document.createElement("li");
    li.textContent = message.user + " - " + message.text;
    document.getElementById("lstMensajes").appendChild(li);
});

conexion.on("GetUsers", (users) => {
    document.getElementById("lstUsuarios").innerHTML = "";
    users.forEach(x => {
        const li = document.createElement("li");
        li.textContent = x.user;
        document.getElementById("lstUsuarios").appendChild(li);
    })
});
// Evento de conexión
//conexion.start().then(() => {
//    const li = document.createElement("li");
//    li.textContent = "Bienvenido al chat";
//    document.getElementById("lstMensajes").appendChild(li);
//}).catch((error) => {
//    console.error(error);
//});

document.getElementById("txtUsuario").addEventListener("input", (event) => {
    document.getElementById("btnConectar").disabled = event.target.value === "";
});

document.getElementById("btnConectar").addEventListener("click", (event) => {
    if (conexion.state === signalR.HubConnectionState.Disconnected) {
        conexion.start().then(() => {
            const li = document.createElement("li");
            li.textContent = "Conectado con el servidor en tiempo real";
            document.getElementById("lstMensajes").appendChild(li);
            document.getElementById("btnConectar").textContent = "Desconectar";
            document.getElementById("txtUsuario").disabled = true;
            document.getElementById("txtMensaje").disabled = false;
            document.getElementById("btnEnviar").disabled = false;

            const usuario = document.getElementById("txtUsuario").value;

            const message = {
                user: usuario,
                text: ""
            }

            conexion.invoke("SendMessage", message).catch(function (error) {
                console.error(error);
            });

        }).catch(function (error) {
            console.error(error);
        });
    }
    else if (conexion.state === signalR.HubConnectionState.Connected) {
        conexion.stop();

        const li = document.createElement("li");
        li.textContent = "Has salido del chat";
        document.getElementById("lstMensajes").appendChild(li);
        document.getElementById("btnConectar").value = "Conectar";
        document.getElementById("txtUsuario").disabled = false;
        document.getElementById("txtMensaje").disabled = true;
        document.getElementById("btnEnviar").disabled = true;
    }
});


document.getElementById("btnEnviar").addEventListener("click", (event) => {
    const usuario = document.getElementById("txtUsuario").value;
    const texto = document.getElementById("txtMensaje").value;
    const data = {
        user: usuario,
        text: texto
    }

    // invoke nos va a comunicar con el hub y el evento para pasarle el mensaje
    conexion.invoke("SendMessage", data).catch((error) => {
        console.error(error);
    });
    document.getElementById("txtMensaje").value = "";
    event.preventDefault(); // Para evitar el submit
})