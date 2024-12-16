const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = './user.proto';

// Cargar definición del archivo .proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(packageDefinition).UserService;

// Base de datos simulada
const users = [{ id: 1, name: "Alice" }];

// Implementación del método GetUsers
function getUsers(call, callback) {
  callback(null, { users });
}

// Configurar servidor gRPC
const server = new grpc.Server();
server.addService(userProto.service, { getUsers });

// Iniciar el servidor
const PORT = 50051;
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`gRPC API escuchando en localhost:${PORT}`);
    server.start();
  }
);