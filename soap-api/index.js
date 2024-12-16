const soap = require('soap');
const http = require('http');

const users = [{ id: 1, name: "Alice" }];

const service = {
  UserService: {
    UserPort: {
      getUsers: (args, callback) => callback(null, { users }),
      createUser: ({ name }) => {
        const newUser = { id: users.length + 1, name };
        users.push(newUser);
        return { id: newUser.id, name: newUser.name };
      },
    },
  },
};

const xml = `
<definitions name="UserService"
    xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
    xmlns:tns="http://example.com/user"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    targetNamespace="http://example.com/user">
  
  <types>
    <xsd:schema targetNamespace="http://example.com/user">
      <xsd:element name="getUsersRequest" type="xsd:string"/>
      <xsd:element name="getUsersResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="users" type="xsd:string" minOccurs="1" maxOccurs="unbounded"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <xsd:element name="createUserRequest">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="name" type="xsd:string"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
      <xsd:element name="createUserResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="id" type="xsd:int"/>
            <xsd:element name="name" type="xsd:string"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
    </xsd:schema>
  </types>

  <message name="getUsersRequest">
    <part name="parameters" element="tns:getUsersRequest"/>
  </message>
  <message name="getUsersResponse">
    <part name="parameters" element="tns:getUsersResponse"/>
  </message>
  
  <message name="createUserRequest">
    <part name="parameters" element="tns:createUserRequest"/>
  </message>
  <message name="createUserResponse">
    <part name="parameters" element="tns:createUserResponse"/>
  </message>

  <portType name="UserPort">
    <operation name="getUsers">
      <input message="tns:getUsersRequest"/>
      <output message="tns:getUsersResponse"/>
    </operation>
    <operation name="createUser">
      <input message="tns:createUserRequest"/>
      <output message="tns:createUserResponse"/>
    </operation>
  </portType>

  <binding name="UserBinding" type="tns:UserPort">
    <soap:binding style="rpc" transport="http://schemas.xmlsoap.org/soap/http"/>
    <operation name="getUsers">
      <soap:operation soapAction="getUsers"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
    </operation>
    <operation name="createUser">
      <soap:operation soapAction="createUser"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
    </operation>
  </binding>

  <service name="UserService">
    <port name="UserPort" binding="tns:UserBinding">
      <soap:address location="http://localhost:8000/wsdl"/>
    </port>
  </service>
</definitions>
`;

const server = http.createServer((req, res) => res.end());
soap.listen(server, '/wsdl', service, xml);

server.listen(8000, () => console.log('SOAP API en http://localhost:8000/wsdl'));