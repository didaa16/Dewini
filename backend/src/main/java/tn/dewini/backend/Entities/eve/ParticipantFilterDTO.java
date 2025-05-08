package tn.dewini.backend.Entities.eve;

import lombok.Data;

@Data
public class ParticipantFilterDTO {
    private Integer page = 0;
    private Integer size = 10;
    private RoleEngagement role;
    private TypeParticipant type;
    private TypeEngagement engagement;
    private String search;

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public RoleEngagement getRole() {
        return role;
    }

    public void setRole(RoleEngagement role) {
        this.role = role;
    }

    public TypeParticipant getType() {
        return type;
    }

    public void setType(TypeParticipant type) {
        this.type = type;
    }

    public TypeEngagement getEngagement() {
        return engagement;
    }

    public void setEngagement(TypeEngagement engagement) {
        this.engagement = engagement;
    }

    public String getSearch() {
        return search;
    }

    public void setSearch(String search) {
        this.search = search;
    }
}