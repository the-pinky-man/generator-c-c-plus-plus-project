/**
 * \file   <%= generatorServiceName %>.h
 * \Author <%= generatorUserName %>, (<%= generatorUserEmail %>)
 * \date   <%=generatorDateGenerated %>
 * \brief  <%= generatorServiceDescription %>
 */

#include "<%= generatorServiceName %>.h"

ACE_FACTORY_DEFINE(<%= generatorServiceName %>, <%= generatorNamespaceUpper %>_<%= generatorServiceName %>);

namespace <%= generatorNamespace %>
{
    <%= generatorServiceName %>::<%= generatorServiceName %>(void)
    {

    }

    int <%= generatorServiceName %>::parse_args(int argc, ACE_TCHAR* argv[])
    {
        return 0;
    }

    int <%= generatorServiceName %>::init(int argc, ACE_TCHAR* argv[])
    {
        parse_args(argc, argv[]);

       <% if (generatorActiveService == 'active') {%> return this->execute(NUM_SVC_THREADS); <% } %>
       <% if (generatorActiveService != 'active') {%> return 0; <% } %>
    }

    int <%= generatorServiceName %>::info(ACE_TCHAR** info_string, size_t length) const
    {
        return 0;
    }

    int <%= generatorServiceName %>::fini(void)
    {
        return 0;
    }

    <% if (generatorActiveService == 'active') {%>

    int <%= generatorServiceName %>::svc(void)
    {
       while (this->isActive() && this->isAvailable())
       {
          // TODO
       }

       return 0;
    }
    <% } %>
}
